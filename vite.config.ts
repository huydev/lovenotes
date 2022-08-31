import postcssNested from "postcss-nested";
export default {
  css: {
    postcss: {
      plugins: [postcssNested()]
    }
  }
}