export default {
    plugins:{
        'postcss-pxtorem':{
            rootValue:75,
            propList:['*'],
            exclude:/node_modules/i,
        }
    }
}