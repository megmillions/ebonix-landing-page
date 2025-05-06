// import main gulp module
import gulp from "gulp";

// import the config modules
import { paths } from "./gulp/config/paths.js ";
import { plugins } from "./gulp/config/plugins.js";

// Define global variable
global.app = {
  isBuild: process.argv.includes("--build"),
  isDev: !process.argv.includes("--build"),
  gulp,
  paths, // object notation equivalent to paths: paths
  plugins,
};

// Import gulp tasks
import { copy } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { views } from "./gulp/tasks/views.js";
import { server } from "./gulp/tasks/server.js";
import { serverPHP } from "./gulp/tasks/serverPHP.js";
import { devScss, tidyCss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/scripts.js";
import { php } from "./gulp/tasks/php.js";
import { images } from "./gulp/tasks/images.js";
import { otfToTtf, ttfToWoff, fontStyle } from "./gulp/tasks/fonts.js";
import { fontsCopy } from "./gulp/tasks/fontsCopy.js";
import { fontsDel } from "./gulp/tasks/fontsDel.js";
import { svgSprite } from "./gulp/tasks/svgSprite.js";

// Watching the working flow
function watcher() {
  gulp.watch(paths.watch.shared, copy);
  gulp.watch(paths.watch.views, views);
  gulp.watch(paths.watch.scss, devScss);
  gulp.watch(paths.watch.js, js);
  gulp.watch(paths.watch.images, images);
}

function phpwatcher() {
  gulp.watch(paths.watch.php, php);
}

// Deside if we are in dev or build mode. Choose css task.
const scss = process.argv.includes("--build") ? tidyCss : devScss;

// Perform tasks sequentially one by one
const convertFonts = gulp.series(fontsDel, otfToTtf, ttfToWoff, fontStyle);

// Main tasks
const mainTasks = gulp.series(
  gulp.parallel(copy, fontsCopy, views, scss, js, images)
);

// Run develpment tasks
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
// Run build tasks. No need in watcher and server
const build = gulp.series(reset, php, mainTasks);
// Run development with PHP
const devPHP = gulp.series(
  reset,
  php,
  mainTasks,
  gulp.parallel(phpwatcher, watcher, serverPHP)
);

// Default gulp task
gulp.task("default", dev);

// Export tasks to perform separately
export { devPHP, build, convertFonts, svgSprite, views };


