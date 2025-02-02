import Vue from "vue";
import SvgIcon from "@/components/SvgIcon"; // svg组件

// register globally
Vue.component("svg-icon", SvgIcon);

const requireAll = requireContext => requireContext.keys().map(requireContext);
// import all svg
const req = require.context("./svg", true, /\.svg$/);
requireAll(req);
