// src/components/ImageUploader.jsx
// 음식 사진을 업로드하고 미리보기를 보여주는 컴포넌트
function ImageUploader({ preview, onFileChange }) {
    return (
        <div style={{ marginTop: "1rem" }}>
            {/* 이미지 파일만 선택 가능 */}
            <input type="file" accept="image/*" onChange={onFileChange} />
            {/* 미리보기 이미지가 있으면 표시 */}
            {preview && (
                <img
                    src={preview}
                    alt="preview"
                    style={{ marginTop: "1rem", maxWidth: "200px", borderRadius: "8px" }}
                />
            )}
        </div>
    );
}

export default ImageUploader;