// src/theme/index.ts

import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'light', // You can set 'dark' as the default if you prefer
    useSystemColorMode: false, // Set this to true if you want to use the user's system preference by default
};

const theme = extendTheme({
    config,
    colors: {
        brand: {
            100: "#f7fafc",
            900: "#1a202c",
        },
    },
});

export default theme;
