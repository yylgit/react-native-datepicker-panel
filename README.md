# Install

```
mnpm install @scfe/react-native-datepicker  --save
```
仓库地址： ssh://git@git.sankuai.com/scfe/react-native-datepicker.git

# API

Props |Type| Description
---|---|---
selectedDate | PropTypes.object | 日历控件的选择时间
setDate | PropTypes.func |  设置时间的回调函数，回调函数的参数为选择的时间
minDate | PropTypes.object | 时间选择的最小时间
maxDate | PropTypes.object | 时间选择的最大时间

# Example

```
'use strict';

import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity
}   from 'react-native';
import DatePicker from './DatePicker';

class TestDatePicker extends Component {
    constructor(props) {
      super(props);
      this.state = {
          date: new Date(),
          showDate: false
      };
    }

    _setDate(date) {
      this.setState({
        date,
        showDate: false
      });
    }

    _stringifyDate(date, format = 'yyyy-MM-dd') {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        return format
        .replace(/yyyy/g, year)
        .replace(/MM/g, ('0' + month).slice(-2))
        .replace(/dd/g, ('0' + day).slice(-2))
        .replace(/yy/g, year)
        .replace(/M(?!a)/g, month)
        .replace(/d/g, day)
    } 

    _renderDate() {
      if(this.state.showDate) {
        return (
          <View>
             <DatePicker selectedDate={this.state.date} setDate={this._setDate.bind(this)} />
          </View>
        );
      } else {
        return null;
      }
    }

    _changeDateShow() {
      this.setState({showDate: !this.state.showDate})
    }

    render() {
        let dateStr = this._stringifyDate(this.state.date);
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row',alignItems: 'center'}}> 
                  <Text style={{width: 80}}>
                    选择日期：
                  </Text>
                  <TouchableOpacity 
                    style={styles.datewrap}
                    onPress={this._changeDateShow.bind(this)}>
                    <Text style={styles.dateText}>
                      {dateStr}
                    </Text>
                  </TouchableOpacity>
                </View>
                {this._renderDate()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 40,
        flex: 1
    },
    datewrap: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginBottom: 5
    },
    dateText: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      borderRadius: 5
    }
    
});


export default TestDatePicker;
```
# Screenshots
![image description](https://cloud.githubusercontent.com/assets/11867564/19833964/8735f4c2-9e87-11e6-9063-9efdfd330ac6.jpg)
![image description](http://dn-cnode.qbox.me/FjC0cy3F215aUKFlNdL1O-qEgkwY)
![image description](http://dn-cnode.qbox.me/FoYM4HUSwMv48pdJqqZMx35XI4xG)
