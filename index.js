'use strict';

import React, { Component, PropTypes } from 'react';

import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity
} from 'react-native';

const {height, width} = Dimensions.get('window');
const weekRange = ['日', '一', '二', '三', '四', '五', '六'];

class DatePicker extends Component {

  static propTypes = {
        selectedDate: PropTypes.object,
        setDate: PropTypes.func,
        minDate: PropTypes.object,
        maxDate: PropTypes.object
    };

  constructor(props) {
      super(props);
      this.state = {
        currDate: new Date(),
        showView: 'date'  //date, month, year三种视图
      };
  }


  componentDidMount() {
    this.setState({
      currDate: this.props.selectedDate || new Date()
    });
  }

  /**
    取消选择后恢复视图
  */
  cancelSelect() {
    let {selectedDate} = this.props;
    this.setState({
      currDate: selectedDate,
      showView: 'date'
    });
  }

  /**
    根据年月参数计算正确的年月
  */
  _getYearMonth(year, month) {
        if (month > 11) {
          year++
            month = 0
        } else if (month < 0) {
          year--
            month = 11
        }
        return {year: year, month: month}
    }

    /**
    获取月份的天数
  */
    _getDayCount(year, month) {
        const dict = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

        if (month === 1) {
          if ( (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0) ) {
            return 29
          }
          return 28
        }
        return dict[month]
    }

    /**
    获取渲染日期的数据
  */
    _getDateRange() {
        let dateRange = [];
        let {currDate} = this.state; 
        let {selectedDate,minDate, maxDate} = this.props;
        const time = {
          year: currDate.getFullYear(),
          month: currDate.getMonth(),
          day: currDate.getDate()
        }

        const currMonthFirstDay = new Date(time.year, time.month, 1)
        let firstDayWeek = currMonthFirstDay.getDay() + 1
        if (firstDayWeek === 0) {
          firstDayWeek = 7
        }
        const dayCount = this._getDayCount(time.year, time.month)
        if (firstDayWeek > 1) {
          const preMonth = this._getYearMonth(time.year, time.month - 1)
          const prevMonthDayCount = this._getDayCount(preMonth.year, preMonth.month)
          for (let i = 1; i < firstDayWeek; i++) {
              const dayText = prevMonthDayCount - firstDayWeek + i + 1
              let date = new Date(preMonth.year, preMonth.month, dayText);              
              dateRange.push({
                text: dayText,
                date,
                sclass: 'gray'
              })
          }
        }

        for (let i = 1; i <= dayCount; i++) {
            const date = new Date(time.year, time.month, i)
            const week = date.getDay()
            let sclass = '';

          if (i === selectedDate.getDate()) {
            if(selectedDate.getFullYear() == time.year && 
              selectedDate.getMonth() == time.month) {
              sclass = 'active'
            }
          }
          if(minDate && minDate instanceof Date) {
            if(date.getTime() < minDate.getTime()) {
                sclass = 'gray';
            }
          }
          if(maxDate && maxDate instanceof Date) {
            if(date.getTime() > maxDate.getTime()) {
                sclass = 'gray';
            }
          }
          dateRange.push({
            text: i,
            date,
            sclass
          })
        }

        if (dateRange.length < 42) {
          const nextMonthNeed = 42 - dateRange.length
          const nextMonth = this._getYearMonth(time.year, time.month + 1)
          for (let i = 1; i <= nextMonthNeed; i++) {
              dateRange.push({
                text: i,
                date: new Date(nextMonth.year, nextMonth.month, i),
                sclass: 'gray'
            })
          }
        }
        return dateRange;
    }

    /**
    渲染星期行
  */
  _renderWeekRow() {
    let {showView} = this.state;
    if(showView !== 'date') return null;
    let weekDomList = [];
    weekRange.forEach(item=>{
      weekDomList.push((
        <TouchableOpacity style={styles.weekUnit} key={item}>
          <Text style={styles.weekText}>{item}</Text>
        </TouchableOpacity>
      ))
    })
    return (
      <View style={styles.weekRow}>
        {weekDomList}
      </View>
    );
    
  }

  /**
    渲染头部
  */
  _renderHeader() {
    let leftArrow = '<';
    let rightArrow = '>';
    let {currDate, showView} = this.state;
    let year = currDate.getFullYear();
    let month = currDate.getMonth() + 1;

        const yearStr = year.toString();
        const startYear = parseInt(yearStr.substring(0, yearStr.length - 1) + 0)
        const endYear = startYear + 10;
    let headerMap = {
      'date': {
        text: `${year}年${month}月`,
        centerPress: ()=>{
          this.setState({
            showView: 'month'
          })
        },
        leftPress: ()=>{
          this._preNextMonthClick(0);
        },
        rightPress: ()=>{
          this._preNextMonthClick(1);
        }
      },
      'month': {
        text: `${year}年`,
        centerPress: ()=>{
          this.setState({
            showView: 'year'
          })
        },
        leftPress: ()=>{
          this._preNextYearClick(0);
        },
        rightPress: ()=>{
          this._preNextYearClick(1);
        }
      },
      'year': {
        text: `${startYear}年-${endYear}年`,
        centerPress: ()=>{
        },
        leftPress: ()=>{
          this._preNextTenYearClick(0);
        },
        rightPress: ()=>{
          this._preNextTenYearClick(1);
        }
      }
    }
    return (
    <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft}
          onPress={headerMap[showView].leftPress}>
          <Text style={styles.headerText}>{leftArrow}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerCenter}
          onPress={headerMap[showView].centerPress}>
          <Text style={styles.headerText}>{headerMap[showView].text}</Text>
        </TouchableOpacity>
      <TouchableOpacity style={styles.headerRight}
        onPress={headerMap[showView].rightPress}>
          <Text style={styles.headerText}>{rightArrow}</Text>
        </TouchableOpacity>
      </View>
      );
  }

  
  /**
    渲染主要内容，data，month，year
  */
  _renderContent() {
    let {showView} = this.state;
    switch (showView) {
      case 'date':
        return this._renderDateContent();
        break;
      case 'month':
        return this._renderMonthContent();
        break;
      case 'year':
        return this._renderYearContent();
        break;
    }
  }

  /**
    渲染month
  */
  _renderMonthContent() {
    let monthList = [
      [{text:'一月', value: 0},
      {text:'二月', value: 1},
      {text:'三月', value: 2},
      {text:'四月', value: 3}],
      [{text:'五月', value: 4},
      {text:'六月', value: 5},
      {text:'七月', value: 6},
      {text:'八月', value: 7}],
      [{text:'九月', value: 7},
      {text:'十月', value: 9},
      {text:'十一月', value: 10},
      {text:'十二月', value: 11}]
    ];
    let {selectedDate, minDate, maxDate} = this.props;
    let {currDate} = this.state;
    let monthDomList = [];
    for (let i = 0; i < 3; i++) {
      let monthRow = [];
      for (let j = 0; j < 4; j++) {
        let item = monthList[i][j];
        let extraTextStyle = null; 
        let extraViewStyle = null;
        if(item.value === selectedDate.getMonth() && 
          currDate.getFullYear() === selectedDate.getFullYear()) {
          extraTextStyle = styles.activeDateText;
          extraViewStyle = styles.activeDateView;
        }
        if(minDate && minDate instanceof Date) {
            if(currDate.getFullYear() < minDate.getFullYear()) {
                extraTextStyle = styles.grayDateText;
                item.disabled = true;
            } 
            else if(currDate.getFullYear() == minDate.getFullYear()) {
                if(item.value < minDate.getMonth()) {
                    extraTextStyle = styles.grayDateText;
                    item.disabled = true;
                }
            }
        }
        if(maxDate && maxDate instanceof Date) {
            if(currDate.getFullYear() > maxDate.getFullYear()) {
                extraTextStyle = styles.grayDateText;
                item.disabled = true;
            } else if(currDate.getFullYear() == maxDate.getFullYear()) {
                if(item.value > maxDate.getMonth()) {
                    extraTextStyle = styles.grayDateText;
                    item.disabled = true;
                }
            }
        }
        
        
        monthRow.push(
          <TouchableOpacity style={[styles.monthUnit,extraViewStyle]} key={item.value}
            onPress={this._monthPress.bind(this, item)}
            >
            <Text style={[styles.monthText,extraTextStyle]}>{item.text}</Text>
          </TouchableOpacity>
        )
      }
      monthDomList.push(
        <View style={styles.monthRow} key={i}>
          {monthRow}
        </View>
      );
    }
    return monthDomList;
  }

  /**
    获取年的数据
  */
  _getYearRange() {
        let yearRange = [];
        let {currDate} = this.state; 
        let {selectedDate,minDate, maxDate} = this.props;
        const time = {
          year: currDate.getFullYear(),
          month: currDate.getMonth(),
          day: currDate.getDate()
        }
        const yearStr = time.year.toString()
        const firstYearOfDecade = (yearStr.substring(0, yearStr.length - 1) + 0) - 1
        for (let i = 0; i < 12; i++) {
          let sclass = '';
          if(i === 0 || i === 11) {
            sclass = 'gray';
          } else if (selectedDate.getFullYear() === parseInt(firstYearOfDecade + i)) {
            sclass = 'active';
          }

          let text = firstYearOfDecade + i;
          if(minDate && minDate instanceof Date) {
            if(text < minDate.getFullYear()) {
              sclass = 'gray';
            }
          }
          if(maxDate && maxDate instanceof Date) {
            if(text > maxDate.getFullYear()) {
              sclass = 'gray';
            }
          }
          yearRange.push({
              text,
              sclass
          })
      }
      return yearRange;
  }

  /**
    渲染年的视图
  */
  _renderYearContent() {
    let yearRange = this._getYearRange();
    let yearList = [];
    for (let i = 0; i < 3; i++) {
      yearList.push(yearRange.slice(i*4, i*4+4))
    }
    let {selectedDate} = this.props;
    let {currDate} = this.state;
    let yearDomList = [];
    for (let i = 0; i < 3; i++) {
      let yearRow = [];
      for (let j = 0; j < 4; j++) {
        let item = yearList[i][j];
        let extraTextStyle = null; 
        let extraViewStyle = null;
        if(item.sclass === 'gray') {
          extraTextStyle = styles.grayDateText;
        } else if (item.sclass === 'active') {
          extraTextStyle = styles.activeDateText;
          extraViewStyle = styles.activeDateView;

        }
        yearRow.push(
          <TouchableOpacity style={[styles.monthUnit,extraViewStyle]} key={item.text}
            onPress={this._yearPress.bind(this, item)}
            >
            <Text style={[styles.monthText,extraTextStyle]}>{item.text}</Text>
          </TouchableOpacity>
        )
      }
      yearDomList.push(
        <View style={styles.monthRow} key={i}>
          {yearRow}
        </View>
      );
    }
    return yearDomList;
  }

  /**
    渲染日期的视图
  */
  _renderDateContent() {
    let dateRange = this._getDateRange();
    let rowArray = [];
    for (let i = 0; i <= 5; i++) {
      rowArray[i] = dateRange.slice(i*7, i*7+7);
    }
    let RowDomList = [];
    for (let i = 0; i < rowArray.length; i++) {
      let UnitDomList = [];
      for (let j = 0; j < rowArray[i].length; j++) {
        let item = rowArray[i][j];
        let extraTextStyle = item.sclass === 'gray' ? styles.grayDateText : 
        item.sclass === 'active' ? styles.activeDateText: null;
        let extraViewStyle = item.sclass === 'active' ? styles.activeDateView: null;
        UnitDomList.push(
          <TouchableOpacity style={[styles.dateUnit,extraViewStyle]} key={i+' '+j}
            onPress={this._datePress.bind(this, item)}
            >
            <Text style={[styles.dateText,extraTextStyle]}>{item.text}</Text>
          </TouchableOpacity>
        );
      } 
      RowDomList.push(
        <View style={styles.dateRow} key={i}>
          {UnitDomList}
        </View>
      );
    }
    return RowDomList;
  }

  /**
    日期选择事件
  */
  _datePress(item) {
    if(item.sclass === 'gray') {
      return;
    }
    if(item.date instanceof Date) {
      this.setState({
        currDate: item.date
      })
      this.props.setDate(item.date);
    }
  }

  /**
    月份选择事件
  */
  _monthPress(month) {
    if(month.disabled) {
        return;
    }
    let {currDate} = this.state;
    this.setState({
      showView: 'date',
      currDate: new Date(currDate.getFullYear(), month.value, currDate.getDate())
    })

  }

  /**
    年份选择事件
  */
  _yearPress(item) {
    if(item.sclass === 'gray') {
      return;
    } 
    let {currDate} = this.state;
    this.setState({
      showView: 'month',
      currDate: new Date(parseInt(item.text), currDate.getMonth(), currDate.getDate())
    })
  }

  /**
    日期视图切换事件
  */
  _preNextMonthClick(flag) {
    let {currDate} = this.state;
        const year = currDate.getFullYear()
        const month = currDate.getMonth()
        const date = currDate.getDate()


        if (flag === 0) {
          const preMonth = this._getYearMonth(year, month - 1)
          this.setState({
            currDate: new Date(preMonth.year, preMonth.month, date)
          })
        } else {
          const nextMonth = this._getYearMonth(year, month + 1)
          this.setState({
            currDate: new Date(nextMonth.year, nextMonth.month, date)
          })
        }
    }

    /**
    月份视图切换事件
  */
    _preNextYearClick(flag) {
      let {currDate} = this.state;
        const year = currDate.getFullYear()
        const months = currDate.getMonth()
        const date = currDate.getDate()

        if (flag === 0) {
          this.setState({
            currDate: new Date(year - 1, months, date)
          });
        } else {
          this.setState({
            currDate: new Date(year + 1, months, date)
          });
        }
    }

  /**
    年份视图切换事件
  */
    _preNextTenYearClick(flag) {
      let {currDate} = this.state;
        const year = currDate.getFullYear()
        const months = currDate.getMonth()
        const date = currDate.getDate()

        if (flag === 0) {
          this.setState({
            currDate: new Date(year - 10, months, date)
          });
        } else {
          this.setState({
            currDate: new Date(year + 10, months, date)
          });
        }
    }


    render() {
      return (
          <View style={styles.container}>
            {this._renderHeader()}
            {this._renderWeekRow()}
            {this._renderContent()}
          </View>
      );
    }
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    width: width - 40,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10
  },
  headerLeft: {
    width: 50,
    alignItems: 'center'
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center'
  },
  headerRight: {
    width: 50,
    alignItems: 'center'
  },
  headerText: {
    fontWeight: '900'
  },
  weekRow: {
    flexDirection: 'row'
  },
  weekUnit: {
    flex: 1,
    height: 26,
    justifyContent: 'center'
  },
  weekText: {
    fontWeight: '900',
    textAlign: 'center'
  },
  dateRow: {
    flexDirection: 'row'
  },
  dateUnit: {
    flex: 1,
    height: 26,
    justifyContent: 'center',
    borderRadius: 5
  },
  dateText: {
    textAlign: 'center'
  },
  grayDateText: {
    color: '#929292'
  },
  activeDateText: {
    color: '#fff'
  },
  activeDateView: {
    backgroundColor: '#06c1ae'
  },
  monthRow: {
    flexDirection: 'row'
  },
  monthUnit: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    borderRadius: 5
  },
  monthText: {
    textAlign: 'center'
  }
});


export default DatePicker;