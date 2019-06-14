<template>
  <svg :class="svgClass" aria-hidden="true" :style="svgColor">
    <use :xlink:href="iconName"/>
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
    iconColor:{
      type: String,
      default: ''
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    svgColor(){
      if (this.iconColor) {
        return {color:this.iconColor}
      } else {
        return  {}
      }
      
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1.1em;
  height: 1.1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.itemmargin{
  margin:0 5px 0 12px;
  color: #409eff;
}
</style>
