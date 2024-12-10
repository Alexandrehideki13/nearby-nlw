import { IconProps } from "@tabler/icons-react-native";
import { ComponentType } from "react";

export interface IStepProps {
  icon: ComponentType<IconProps>;
  title: string;
  description: string;
};