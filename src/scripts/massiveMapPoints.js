// scripts/massiveMapPoint.js
// 高德地图海量点类

class MassiveMapPoint {
  // 这个点的id、经纬度、地图上的图标、文字
  constructor(name, position, icon, text,otherData) {
    this.name = name;
    this.position = position;
    this.icon = icon;
    this.text = text;
    this.otherData = otherData;
  }

  // 获取名称的方法
  getName() {
    return this.name;
  }

  // 设置名称的方法
  setName(newName) {
    this.name = newName;
  }

  // 获取位置的方法
  getPosition() {
    return this.position;
  }

  // 设置位置的方法
  setPosition(newPosition) {
    this.position = newPosition;
  }

  // 获取图标的方法
  getIcon() {
    return this.icon;
  }

  // 设置图标的方法
  setIcon(newIcon) {
    this.icon = newIcon;
  }

  // 获取文本的方法
  getText() {
    return this.text;
  }

  // 设置文本的方法
  setText(newText) {
    this.text = newText;
  }
  // 获取手机的方法
  getOtherData() {
    return this.otherData;
  }

  // 设置手机的方法
  setOtherData(otherData) {
    this.phone = otherData;
  }

  // 创建标签标记的类方法
  createLabelMarker() {
    const labelMarker = new AMap.LabelMarker({
      name: this.name,
      position: this.position,
      icon: this.icon,
      text: this.text,
      extData: this.otherData
    });

    // 如果需要，执行任何其他操作或配置

    return labelMarker;
  }

  // 其他类方法可以根据需要添加
}

// 导出类以使其在模块外可访问
export default MassiveMapPoint;
