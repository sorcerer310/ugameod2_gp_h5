export class ExportExcel {

  constructor(){
    this.XLSX = require('xlsx')
  }

  /**
   * 将数据源导出为excel
   * @param filename  导出文件名
   */
  /**
   * 将数据源导出为excel
   * @param filename  导出文件名
   * @param ds        数据源
   * @param doma      用于模拟下载效果的a标签
   */
  export(filename, ds,doma,domtable) {
    //导出数据源
    var data = [{}];
    //写入表头
    domtable.find('th').each(i=>{
      data[0][i] =domtable.find('th')[i].textContent;
    });
    //连接数据
    data = data.concat(ds);
    this.downloadExl(data, filename,doma);
  }

  downloadExl(json, downName,doma, type) {  // 导出到excel
    var keyMap = [] // 获取键
    for (var k in json[0]) {
      keyMap.push(k)
    }
    console.info('keyMap', keyMap, json)
    var tmpdata = [] // 用来保存转换好的json
    json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
      v: v[k],
      position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
    }))).reduce((prev, next) => prev.concat(next)).forEach(function (v) {
      tmpdata[v.position] = {
        v: v.v
      }
    })
    var outputPos = Object.keys(tmpdata)  // 设置区域,比如表格从A1到D10
    var tmpWB = {
      SheetNames: ['mySheet'], // 保存的表标题
      Sheets: {
        'mySheet': Object.assign({},
          tmpdata, // 内容
          {
            '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
          })
      }
    }
    var tmpDown = new Blob([this.s2ab(this.XLSX.write(tmpWB,
      {bookType: (type === undefined ? 'xlsx' : type), bookSST: false, type: 'binary'} // 这里的数据是用来定义导出的格式类型
    ))], {
      type: ''
    })  // 创建二进制对象写入转换好的字节流
    var href = URL.createObjectURL(tmpDown)  // 创建对象超链接
    doma.download = downName + '.xlsx'  // 下载名称
    doma.href = href  // 绑定a标签
    doma.click()  // 模拟点击实现下载
    setTimeout(function () {  // 延时释放
      URL.revokeObjectURL(tmpDown) // 用URL.revokeObjectURL()来释放这个object URL
    }, 100)
  }
  s2ab (s) { // 字符串转字符流
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF
    }
    return buf
  }
}
