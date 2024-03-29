// https://vitejs.dev/config/
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
//@ts-ignore
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        server: {
            port: 5000,
        },
        build: {
            outDir: env.VITE_OUTPUT_DIR,
        },
        resolve: {
            alias: {
                '@': path.resolve('src'), //配置src的别名
            },
        },
        css: {
            preprocessorOptions: {
                //定义全局scss变量
                scss: {
                    javascriptEnabled: true,
                    additionalData: '@import "./src/assets/css/theme-default.scss";',
                },
            },
        },
        plugins: [
            vue(),
            createSvgIconsPlugin({
                // 指定需要缓存的图标文件夹
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
                // 指定symbolId格式
                symbolId: 'icon-[dir]-[name]',

                /**
                 * 自定义插入位置
                 * @default: body-last
                 */
                // inject?: 'body-last' | 'body-first'

                /**
                 * custom dom id
                 * @default: __svg__icons__dom__
                 */
                // customDomId: '__svg__icons__dom__',
            }),
        ],
    };
});
