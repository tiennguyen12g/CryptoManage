

const lightTheme = {
  primary: 'rgb(245,98,81)',
  secondary:'rgb(248,140,69)',
  tertiary:'rgb(255,179,102)',
  background: 'rgb(255, 255, 255)',

  textTitle:"rgb(0,0,0)",
  textSubtitle:"rgb(107,114,128)",
  textSecondary: "rgb(156,156,156)",
  textNormal:"rgb(145, 145, 145)",
  textButtonGradient:"white",
  textButtonBorder:"black",

  button_Gradient_1:"rgb(252,204,50)",
  button_Gradient_2:"rgb(245,95,82)",

  activeIcon: 'rgb(248,140,69)',
  deactiveIcon:'rgb(161, 161, 161)',

}
const darkTheme = {
  primary: 'rgb(245,98,81)',
  secondary:'rgb(248,140,69)',
  tertiary:'rgb(255,179,102)',
  background: 'rgb(255, 255, 255)',

  textTitle:"rgb(0,0,0)",
  textSubtitle:"rgb(107,114,128)",
  textSecondary: "rgb(156,156,156)",
  textNormal:"rgb(145, 145, 145)",
  textButtonGradient:"white",
  textButtonBorder:"black",

  button_Gradient_1:"rgb(252,204,50)",
  button_Gradient_2:"rgb(245,95,82)",

  activeIcon: 'rgb(248,140,69)',
  deactiveIcon:'rgb(217,217,217)',
}

const sizeDefault = {
  sizeTitle: 26,
  sizeSubtitle: 20,
  sizeNormalText: 16,
  size_Small_Text: 12,
}
export {lightTheme, darkTheme, sizeDefault,}


const customTheme = {
  dark: false,
  colors: {
      primary: 'rgb(245,98,81)',
      secondary:'rgb(248,140,69)',
      tertiary:'rgb(255,179,102)',
      background: 'rgb(255, 255, 255)',

      textTitle:"rgb(0,0,0)",
      textSubtitle:"rgb(107,114,128)",
      textSecondary: "rgb(156,156,156)",
      textButtonGradient:"white",
      textButtonBorder:"black",

      sizeTitle: 50,
      sizeSubtitle: 20,
      sizeNormalText: 16,
      size_Small_Text: 12,

      button_Gradient_1:"rgb(252,204,50)",
      button_Gradient_2:"rgb(245,95,82)",

      activeIcon: 'rgb(248,140,69)',
      deactiveIcon:'rgb(217,217,217)',

      // default value of the package
      card: 'rgb(255, 255, 255)',
      text: 'rgb(28, 28, 30)',
      border: 'rgb(199, 199, 204)',
      notification: 'rgb(255, 69, 58)',
  },
};
export default customTheme;
export type Theme = typeof customTheme;
