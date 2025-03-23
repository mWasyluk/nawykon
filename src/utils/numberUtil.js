export const NumberUtil = {
    roundToOneDecimal: (value) => {
        return value.toFixed(1);
    },
    roundToMaxOneDecimal: (value) => {
        return NumberUtil.roundToOneDecimal(value).replace(/\.?0*$/, '');
    }
};
