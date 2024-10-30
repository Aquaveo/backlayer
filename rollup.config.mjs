import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
export default {
  input: "src/index.js",
  output: {
    dir: 'dist', // specify the output directory
    format: "cjs",
    sourcemap: true, // enables source map generation
},
plugins: [
  babel({
    presets: ["@babel/preset-env", "@babel/preset-react"],
    exclude: "node_modules/**",
  }),
  commonjs(),
  resolve(),
  postcss({
    modules: true,
    }),
  ],
  external: ["react", "react-dom"],
};