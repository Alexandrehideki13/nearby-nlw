import { IconProps } from "@tabler/icons-react-native";
import { Text, View } from "react-native";
import { s } from "./styles";
import { ComponentType } from "react";
import { colors } from "@/app/styles/colors";

type Props = {
  icon: ComponentType<IconProps>;
  description: string;
}

export function Info({ icon: Icon, description }: Props) {
  return (
    <View style={s.container}>
      <Icon size={16} color={colors.gray[400]} />
      <Text style={s.text}>{description}</Text>
    </View>
  );
}