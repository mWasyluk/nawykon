import { BodyBoldText, BodyText } from "@components/text";
import { colors, metrics } from "@styles";

const VARIANTS = {
    completed: { backgroundColor: colors.lightSuccess, color: colors.light },
    partial: { backgroundColor: colors.lightWarning, color: colors.darkGray },
    failed: { backgroundColor: colors.lightError, color: colors.light },
    neutral: { backgroundColor: colors.lightGray, color: colors.darkGray },
}

export const PROGRESS_VIEW_SIZES = {
    SMALL: 'small',
    DEFAULT: 'default',
}

export default function HabitProgressView(props) {
    const {
        completed = undefined,
        goal = undefined,
        size = PROGRESS_VIEW_SIZES.DEFAULT,
    } = props;


    const progress = (goal && completed) && completed / goal;
    if (progress !== undefined) {
        var variantStyle = !goal ? VARIANTS.neutral
            : progress >= 1 ? VARIANTS.completed
                : progress <= 0 ? VARIANTS.failed
                    : VARIANTS.partial;
    }

    var style = {
        paddingHorizontal: metrics.spacing.sm,
        borderRadius: metrics.borderRadius.circular,
        ...variantStyle,
    };

    var smallSizeStyle = {
        ...style,
        paddingHorizontal: 3,
        lineHeight: 16,
    };

    const text = (completed || 0) + '/' + (goal || 0);

    return (
        <>
            {size === PROGRESS_VIEW_SIZES.SMALL
                ? <BodyText style={smallSizeStyle}>
                    {text}
                </BodyText>
                : <BodyBoldText style={style}>
                    {text}
                </BodyBoldText>
            }
        </>
    );
}
