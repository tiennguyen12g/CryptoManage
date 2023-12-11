import type {Theme} from "../Theme/Themes";
declare module "@react-navigation/native" {
    export function useTheme(): Theme
}