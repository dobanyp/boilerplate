// import modules


const {
    series,
    src,
    watch,
    dest
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
// const babel = require('gulp-babel');
// const terser = require('gulp-terser');
const webpack = require('webpack-stream');
const compiler = require('webpack');
const browserSync = require('browser-sync');


const {
    notify
} = require('browser-sync');
const imagemin = require('gulp-imagemin');


// scss task
function buildStyles() {
    return src('app/scss/style.scss', {
            sourcemaps: true
        })
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('dist', {
            sourcemaps: '.'
        }));
}

// js task

/*

function buildJs() {
    return src('./app/js/script.js', {
            sourcemaps: true
        })
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(terser())
        .pipe(dest('dist', {
            sourcemaps: '.'
        }));
}
*/

function buildJs() {
    return src('app/js/entry.js', {
            sourcemaps: true
        })
        .pipe(webpack(require('./webpack.config.js'), compiler))
        .pipe(dest('dist', {
            sourcemaps: '.'
        }));
}

// BrowserSync
function browserSyncServe(done) {
    browserSync.init({
        server: "./dist",
        notify: {
            styles: {
                top: 'auto',
                bottom: '0'
            }
        }
    });
    done();
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}


// Image Compression
function imageCompression() {
    return src('app/images/*')
        .pipe(imagemin())
        .pipe(dest('dist/img'))
}

// watch task
function watchTask() {
    watch('dist/*.html', browserSyncReload);
    watch(
        ['app/scss/**/*.scss', 'app/**/*.js', 'app/*.html'],
        series(buildStyles, buildJs, browserSyncReload)
    );
    watch('app/images', imageCompression)
}

exports.default = series(imageCompression, buildStyles, buildJs, browserSyncServe, watchTask);