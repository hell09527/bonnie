// 静态数据
const staticData = {
    mine: {
        orderList: [{
            name: '待付款',
            index: 0,
            num: 0,
            icon: '/images/member/pay.png'
        },
        {
            name: '待发货',
            index: 1,
            num: 0,
            icon: '/images/member/send.png'
        },
        {
            name: '待收货',
            index: 2,
            num: 0,
            icon: '/images/member/recieve.png'
        },
        {
            name: '以收货',
            index: 3,
            num: 0,
            icon: '/images/member/received.png'
        },
        {
            name: '退款/售后',
            index: 5,
            num: 0,
            icon: '/images/member/reback.png'
        }],
        itemsList: [{
            icon: 'https://static.vitasantee.com/personal@2x.png',
            name: '个人资料',
            url: 'member/personaldata/personaldata',
            show: true
        },
        {
            icon: 'https://static.vitasantee.com/idress@2x.png',
            name: '收货地址',
            url: 'member/memberaddress/memberaddress?flag=1',
            show: true
        },
        {
            icon: 'https://static.vitasantee.com/mark@2x.png',
            name: '我的足迹',
            url: 'member/newmypath/newmypath',
            show: true
        },
        {
            icon: 'https://static.vitasantee.com/icon-pt.png',
            name: '我的拼团',
            url: 'index/assemble/assemble?show_status=2',
            show: true
        },
        {
            icon: 'https://static.vitasantee.com/WechatIMG20.png',
            name: '惠选师',
            url: 'member/kol/kol',
            show: false
        },{
            icon: 'https://static.vitasantee.com/valuate@2x.png',
            name: '我的评价',
            url: '',
            show: false
        }]
    }
}
module.exports = staticData;