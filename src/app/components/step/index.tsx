import { Text, View } from "react-native";
import { s } from "./styles";
import { IStepProps } from "./types";
import { colors } from "@/app/styles/colors";

export function Step({
  icon: Icon,
  title,
  description,
}: IStepProps) {
  return (
    <View style={s.container}>
      <Icon size={32} color={colors.red.base} />

      <View style={s.details}>
        <Text style={s.title}>{title}</Text>

        <Text style={s.description}>{description}</Text>
      </View>
    </View>
  );
}