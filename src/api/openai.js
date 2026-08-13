// export -> 파일 바깥에서 함수를 가져다 쓸 수 있게 내보낸다
// async -> 비동기로 동작할거라 선언 (나중에 실제 api 호출시 await을 씀)
export async function analyzeMealWithLLM({ prompt, imageDataUrl, systemPrompt }) {

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY; // env에서 키 읽기

    if (!apiKey) {
        throw new Error("❌ OpenAI API 키가 없습니다. .env 확인하세요!");
    }

    // 📝 메시지 배열을 먼저 만듦
    const messages = [];

    // 🎭 시스템 프롬프트가 있으면 맨 앞에 추가
    if (systemPrompt) {
        messages.push({
            role: "system",
            content: systemPrompt
        });
    }

    // 👤 사용자 메시지 추가
    messages.push({
        role: "user",
        content: [
            { type: "text", text: prompt },
            imageDataUrl ? { type: "image_url", image_url: { url: imageDataUrl } } : null,
        ].filter(Boolean) // imageDataUrl 없으면 제외
    });

    // 🚀 API 요청 body 생성
    const body = {
        model: "gpt-4o-mini",
        messages: messages,  // 위에서 만든 messages 배열 사용!
    };

    // await -> 서버의 응답이 들어올 때까지 멈춤
    // 브라우저의 fetch로 openai chat completions api에 요청 보냄
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // 보낼 데이터가 JSON이라는 뜻
            Authorization: `Bearer ${apiKey}`, // Bearer 토큰 형식으로 API키 전달
        },
        body: JSON.stringify(body),
    });

    // 응답의 HTTP 상태코드가 200대가 아니면(오류면) 서버가 보낸 에러 메시지까지 읽어서 자세한 오류로 다시 던짐
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API 오류: ${response.status}\n${errText}`);
    }

    const data = await response.json(); // 응답 바디를 JSON 객체로 파싱
    return data.choices[0].message.content; // 모델이 생성한 텍스트 -> 모델의 첫번째 응답(choices[0])에서 텍스트 결과만 꺼내서 반환
    // 이 값이 App.jsx로 넘어가서 화면에 표시
}

// 파일 -> Data URL 변환 헬퍼
export function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("이미지 변환 오류"));
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

// 식단 추천 함수 (2개의 레시피 추천)
export async function recommendMealRecipe(analysisResult) {
    const systemPrompt = `
당신은 비건 식단 전문 영양사입니다. 
분석된 식단을 기반으로 더 건강하고 비건 친화적인 식단을 2개 추천해주세요.

**추천 원칙:**
1. 현재 식단의 영양 성분을 고려하여 부족한 영양소를 보완할 수 있는 식단 추천
2. 비건 친화적인 재료 사용
3. 간단하고 실용적인 레시피
4. 탄소발자국이 낮은 식재료 선호
5. 2개의 레시피는 서로 다른 특징을 가져야 함 (예: 다른 주재료, 다른 조리법 등)

**응답 형식 (각 레시피마다 반복):**
---레시피 1---
🍽️ **추천 식단명**
[식단 이름]

📋 **필요한 식재료**
- [재료1] [양]
- [재료2] [양]
- [재료3] [양]

👨‍🍳 **간단한 조리법**
1. [첫 번째 단계]
2. [두 번째 단계]
3. [세 번째 단계]

💡 **추천 이유**
[왜 이 식단을 추천하는지 설명]

---레시피 2---
[동일한 형식]
`.trim();

    const userPrompt = `
다음은 현재 분석된 식단입니다:

${analysisResult}

이 식단을 기반으로 건강하고 비건 친화적인 대체 식단을 2개 추천해주세요.
각 레시피는 서로 다른 특징을 가져야 합니다.
위 형식에 맞춰 2개의 레시피를 모두 응답해주세요.
`.trim();

    try {
        const result = await analyzeMealWithLLM({
            prompt: userPrompt,
            systemPrompt,
            imageDataUrl: null
        });
        return result;
    } catch (e) {
        console.error('식단 추천 실패:', e);
        return null;
    }
}

// 식재료 추출 함수
export async function extractIngredients(recommendedRecipe) {
    const systemPrompt = `
당신은 식재료 추출 전문가입니다.
추천된 레시피에서 사용된 식재료와 그 양을 정확하게 추출해주세요.

JSON 형식으로 응답:
{
    "ingredients": [
        {"name": "재료명", "amount": "양", "unit": "단위"},
        ...
    ]
}
`.trim();

    const userPrompt = `
다음 레시피에서 사용된 식재료를 모두 추출해주세요:

${recommendedRecipe}

JSON 형식으로 응답해주세요.
`.trim();

    try {
        const result = await analyzeMealWithLLM({
            prompt: userPrompt,
            systemPrompt,
            imageDataUrl: null
        });

        let jsonStr = result.trim();
        if (jsonStr.includes('```json')) {
            jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
        } else if (jsonStr.includes('```')) {
            jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
        }

        const parsed = JSON.parse(jsonStr);
        return parsed.ingredients || [];
    } catch (e) {
        console.error('식재료 추출 실패:', e);
        return [];
    }
}

// 개별 식단의 탄소발자국 계산 함수
export async function calculateSingleMealCarbonFootprint(analysisResult, ingredients = null) {
    const systemPrompt = `
당신은 환경 영향 분석 전문가입니다.

**식재료별 CO2 배출량 (1kg 기준):**
- 쇠고기: 27kg CO2
- 돼지고기: 12.1kg CO2
- 닭고기: 6.9kg CO2
- 생선: 6.1kg CO2
- 달걀: 4.2kg CO2
- 치즈: 13.5kg CO2
- 우유: 3.2kg CO2
- 쌀: 2.7kg CO2
- 밀: 1.4kg CO2
- 채소류 (토마토, 오이, 상추 등): 0.4kg CO2
- 과일류 (사과, 바나나 등): 0.4kg CO2
- 콩류 (두부, 콩 등): 1.0kg CO2
- 견과류: 2.3kg CO2

**계산 방법:**
1. 각 식재료의 양을 파악 (g 단위로 환산)
2. 식재료별 CO2 배출량 × 양(kg) = 총 CO2 배출량
3. 일반 육류 식사(7.2kg CO2) 대비 절약량 계산

JSON 형식으로 응답:
{
    "totalCO2Emission": 숫자,
    "co2Saved": 숫자,
    "ingredientBreakdown": [
        {"name": "재료명", "amount": "양", "co2Emission": 숫자}
    ]
}
`.trim();

    const userPrompt = `
다음은 분석된 식단입니다:

${analysisResult}

${ingredients ? `
다음은 추천된 식단의 식재료 목록입니다:

${JSON.stringify(ingredients, null, 2)}
` : ''}

이 식단의 탄소발자국을 계산해주세요.
위 형식의 JSON으로 응답해주세요.
`.trim();

    try {
        const result = await analyzeMealWithLLM({
            prompt: userPrompt,
            systemPrompt,
            imageDataUrl: null
        });

        let jsonStr = result.trim();
        if (jsonStr.includes('```json')) {
            jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
        } else if (jsonStr.includes('```')) {
            jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
        }

        const parsed = JSON.parse(jsonStr);
        return {
            totalCO2Emission: parseFloat(parsed.totalCO2Emission || 0).toFixed(2),
            co2Saved: parseFloat(parsed.co2Saved || 0).toFixed(2),
            ingredientBreakdown: parsed.ingredientBreakdown || []
        };
    } catch (e) {
        console.error('개별 식단 탄소발자국 계산 실패:', e);
        return {
            totalCO2Emission: '0.00',
            co2Saved: '0.00',
            ingredientBreakdown: []
        };
    }
}

// 탄소발자국 계산 프롬프팅
export async function calculateCarbonFootprint(mealsData) {
    const systemPrompt = `
당신은 환경 영향 분석 전문가입니다.

**CO2 절약량 기준 (일반 육류 식사 7.2kg 대비):**
- 완전 비건: 5.7kg 절약
- 락토-오보 (달걀/우유): 4.7kg 절약
- 페스코 (생선): 2.7kg 절약
- 육류 포함: 0kg 절약

**계산 방식:**
각 식단의 비건 친화도를 정확히 판단하고, 위 기준에 따라 CO2 절약량 합산

JSON만 응답:
{
    "totalCO2Saved": 숫자,
    "veganRate": 숫자,
    "mealCount": 숫자
}
`;

    const userPrompt = `
총 ${mealsData.length}개 식단 분석:

${mealsData.map((meal, idx) => `
=== ${idx + 1}번째 식단 ===
${meal.analysis}
`).join('\n\n')}

**각 식단마다:**
1. 동물성 재료 확인
    - 육류(소/돼지/닭 등) 있음 → 육류 포함 (0kg)
    - 생선만 있음 → 페스코 (2.7kg)
    - 달걀/우유만 있음 → 락토-오보 (4.7kg)
    - 동물성 전혀 없음 → 완전 비건 (5.7kg)

2. totalCO2Saved = 각 식단의 절약량 합산
3. veganRate = (완전 비건 개수 ÷ ${mealsData.length}) × 100

**예시:**
- 완전 비건 2개 + 페스코 1개 = 5.7+5.7+2.7 = 14.1kg, 비건율 66%
- 락토-오보 1개 + 육류 1개 = 4.7+0 = 4.7kg, 비건율 0%

지금 계산해서 JSON으로 응답하세요.
`;

    try {
        const result = await analyzeMealWithLLM({
            prompt: userPrompt,
            systemPrompt,
            imageDataUrl: null
        });

        console.log("LLM 원본 응답:", result);

        let jsonStr = result.trim();
        if (jsonStr.includes('```json')) {
            jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
        } else if (jsonStr.includes('```')) {
            jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
        }

        const parsed = JSON.parse(jsonStr);
        console.log("파싱된 결과:", parsed);

        return {
            co2Saved: parseFloat(parsed.totalCO2Saved).toFixed(1),
            veganRate: Math.round(parsed.veganRate),
            mealCount: parsed.mealCount
        };
    } catch (e) {
        console.error('탄소발자국 계산 실패:', e);
        return {
            co2Saved: '0.0',
            veganRate: 0,
            mealCount: mealsData.length
        };
    }
}