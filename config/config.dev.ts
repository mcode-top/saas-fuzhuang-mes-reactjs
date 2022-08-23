// https://umijs.org/config/
import { defineConfig, ICreateCSSRule } from 'umi';

export default defineConfig({
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  chainWebpack(memo: import("webpack-chain"), args: { type: 'ssr' | 'csr'; webpack: typeof import("@umijs/deps/compiled/webpack"); env: 'development' | 'production'; createCSSRule: ICreateCSSRule; }): void {
    memo.devServer.disableHostCheck(true)
  },
});
