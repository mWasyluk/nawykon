import routes from '@data/router';
import { Redirect } from 'expo-router';

export default function Index() {
    return <Redirect href={routes.dashboard} />;
}
