<!--
 * @Description:
 * @Author: zhaodacheng5
 * @Date: 2021-09-09 14:25:22
 * @LastEditors: zhaodacheng5
 * @LastEditTime: 2021-09-11 10:53:00

-->
<script>
export default {
  name: 'Element',
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data() {
    return { visible: false };
  },
  computed: {
    getBgColor() {
      switch (this.node.type) {
        case 'start':
          return '#2080F7';
        case 'func':
          return '#fa8c16';
        case 'algo':
          return '#fa541c';
        case 'action':
          return '#a0d911';
        default:
          return '#2080F7';
      }
    },
    display() {
      return 'none';
    }
  },
  methods: {
    addNode(type) {
      this.$emit('addNode', type, this.node);
    },
    delNode() {
      this.$emit('delNode', this.node);
    }
  },
  render() {
    console.log(this.node.type);
    return (
      <div
        class='node-container'
        style={{ paddingTop: this.node.type === 'branch' ? '20px' : '0' }}
      >
        {/* 卡片 */}
        <div
          class='node-card'
          style={{ display: this.node.type === 'empty' ? 'none' : 'block' }}
        >
          <div
            class='node-card__header'
            style={{ background: this.getBgColor }}
          >
            {this.node.name}
            <el-button
              icon='h-icon-close_sm'
              size='small'
              onClick={() => this.delNode()}
            />
          </div>
          <div class='node-card__body'></div>
        </div>
        {/* 连接线 */}
        <div class='node-add'>
          <el-popover
            ref='popover'
            placement='right'
            width='400'
            title='添加节点'
            trigger='click'
          >
            <div>
              <el-button type='primary' onClick={() => this.addNode('func')}>
                函数
              </el-button>{' '}
              <el-button type='primary' onClick={() => this.addNode('algo')}>
                算法
              </el-button>{' '}
              <el-button
                type='primary'
                onClick={() => this.addNode('condition')}
              >
                条件
              </el-button>
            </div>
            <el-button
              slot='reference'
              type='primary'
              size='mini'
              icon='h-icon-add_sm'
              radius={true}
              onClick={() => (this.visible = !this.visible)}
            ></el-button>
          </el-popover>
        </div>
      </div>
    );
  }
};
</script>
<style lang="scss" scoped>
.node-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 0 20px;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 2px;
    height: calc(100% + 2px);
    background-color: #d9d9d9;
  }
}
.node-card {
  z-index: 10;
  width: 160px;
  height: 80px;
  box-shadow: 0 8px 12px 0 rgb(0 0 0 / 10%);
  border-radius: 3px;
  cursor: pointer;
  background: #fff;
  &__header {
    color: #fff;
    border-radius: 4px 4px 0 0;
    width: 100%;
    height: 30px;
    padding-left: 10px;
    // font-weight: 550;
    font-size: 14px;
    line-height: 30px;
    background-color: antiquewhite;
    display: flex;
    justify-content: space-between;
    .el-button {
      display: none;
      color: #fff;
    }
    &:hover {
      .el-button {
        display: block;
      }
    }
  }
  &__body {
    padding: 5px 10px;
    font-size: 12px;
  }
}
.node-add {
  z-index: 10;
  height: 60px;
  margin: 0 auto;
  padding-top: 20px;
}
</style>
