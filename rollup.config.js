import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const config = [
    {
        input: 'src/content-slider.js',
        output: {
            name: 'ContentSlider',
            file: 'dist/content-slider.js',
            format: 'umd'
        },
        plugins: [babel({ babelHelpers: 'bundled' })]
    },
    {
        input: 'src/content-slider.js',
        output: {
            name: 'ContentSlider',
            file: 'dist/content-slider.min.js',
            format: 'umd',
            plugins: [terser()]
        },
        plugins: [babel({ babelHelpers: 'bundled' })]
    }
];

export default config;
