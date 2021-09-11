<script>
import Chart from './chart';
// import Panel from './panel';

export default {
  name: 'Flow',
  data() {
    return {
      zoomValue: 100, // 缩放比例
      step: 5 // 缩放步长
    };
  },
  methods: {
    changeZoom(type) {
      if (type === 'add') {
        this.zoomValue += this.step;
        console.log(this.zoomValue);
      } else if (type === 'minus') {
        this.zoomValue -= this.step;
      }
    }
  },
  render() {
    return (
      <div class='flow-container'>
        {/* 缩放工具 */}
        <div class='zoom-bar'>
          <el-button
            icon='h-icon-minus'
            onClick={() => this.changeZoom('minus')}
          />
          <span class='zoom-bar__value'>{this.zoomValue + '%'}</span>
          <el-button icon='h-icon-add' onClick={() => this.changeZoom('add')} />
        </div>
        {/* 流程图*/}
        <Chart style={{ transform: `scale(${this.zoomValue / 100})` }}></Chart>
        {/* 抽屉  <Panel></Panel>*/}
      </div>
    );
  }
};
</script>
<style lang="scss" scoped>
.flow-container {
  height: 100%;
  width: 100%;
  padding: 20px;
  overflow: auto;
  background-color: #f5f5f5;
}

.zoom-bar {
  position: fixed;
  z-index: 999;
  right: 30px;
  bottom: 30px;
  background-color: #fff;
  width: 100px;
  &__value {
    text-align: center;
    display: inline-block;
    width: 36px;
  }
}
</style>
