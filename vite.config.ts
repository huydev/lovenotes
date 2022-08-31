import postcssNested from "postcss-nested";
export default {
  base: './',
  css: {
    postcss: {
      plugins: [postcssNested()]
    }
  }
}