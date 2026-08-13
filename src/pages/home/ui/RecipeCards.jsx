import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { ImageWithFallback } from "../figma-temp/ImageWithFallback";

import { Clock, Users } from "lucide-react";

export default function RecipeCards({ recipe }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-700">
              {recipe.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <CardTitle className="mb-2 group-hover:text-green-600 transition-colors">
          {recipe.title}
        </CardTitle>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {recipe.time}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {recipe.servings}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {recipe.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full group-hover:bg-green-600 group-hover:text-white"
        >
          레시피 보기
        </Button>
      </CardContent>
    </Card>
  );
}
