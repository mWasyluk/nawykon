import Button from "@components/input/Button";
import { INPUT_VARIANTS } from "@components/input/InputContainer";
import { useReset } from "@contexts/ProvidersWrapper";
import { colors, icons, metrics } from "@styles";
import { useState } from "react";
import { View } from "react-native";
import { DebugService } from "./debugService";

export const DebuggerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { resetApp } = useReset();

    const handleImport = async () => {
        await DebugService.importDumpData();
    };

    const handleExport = async () => {
        await DebugService.exportDumpData();
    }

    const handleReset = async () => {
        resetApp();
    }

    const handleClear = async () => {
        await DebugService.clearAll();
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    }

    if (!__DEV__) {
        return null;
    }

    return (
        <View style={styles.container}>
            {isOpen ? (<>
                <Button
                    title="Reset state"
                    variant={INPUT_VARIANTS.PRIME}
                    onPress={handleReset}
                />
                <Button
                    title="Import data"
                    variant={INPUT_VARIANTS.DEFAULT}
                    onPress={handleImport}
                />
                <Button
                    title="Export data"
                    variant={INPUT_VARIANTS.DEFAULT}
                    onPress={handleExport}
                />
                <Button
                    title="Clear all data"
                    variant={INPUT_VARIANTS.ERROR}
                    onPress={handleClear}
                />
                <Button
                    icon={icons.eyeCrossed}
                    variant={INPUT_VARIANTS.DEFAULT}
                    onPress={handleToggle}
                    style={{ alignSelf: 'flex-start' }}
                />
            </>
            ) : (
                <Button
                    icon={icons.eye}
                    variant={INPUT_VARIANTS.ERROR}
                    onPress={handleToggle}
                />
            )}
        </View>
    );
}

const styles = {
    container: {
        position: 'absolute',
        bottom: metrics.spacing.xs,
        left: metrics.spacing.xs,
        padding: metrics.spacing.xs,
        gap: metrics.spacing.xs,
        borderRadius: metrics.borderRadius.sm,
        backgroundColor: `${colors.lightWarning}AA`,
    },
};
