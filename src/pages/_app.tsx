import type {AppType} from "next/app";
import {trpc} from "@/utils/trpc";
import {ChakraProvider} from '@chakra-ui/react';
import theme from "@/theme";

const MyApp: AppType = ({Component, pageProps}) => {
    return <ChakraProvider theme={theme}><Component {...pageProps} /></ChakraProvider>;
};

export default trpc.withTRPC(MyApp);
