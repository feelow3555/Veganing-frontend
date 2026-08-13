import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { veganRecipes } from "../data/veganRecipes.js";
import RecipeCard from "../ui/RecipeCards.jsx";
import { ChefHat } from "lucide-react";

export function VeganRecipes() {
    return (
        <section id="recipes" className="py-20 bg-white">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <Badge variant="outline" className="mb-4">
                        <ChefHat className="w-4 h-4 mr-2" />
                        인기 레시피
                    </Badge>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        맛있는 비건 레시피
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        영양가 높고 맛있는 식물성 요리법을 발견해보세요.
                        초보자도 쉽게 따라할 수 있습니다.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {veganRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                        더 많은 레시피 보기
                    </Button>
                </div>

            </div>
        </section>
    );
}
