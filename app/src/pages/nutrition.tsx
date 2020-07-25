import * as React from 'react';
import {createUseStyles} from 'react-jss';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';

const useStyles = createUseStyles((theme) => ({
    test: {
        color: 'red',
    },
}));

const Nutrition: React.FC = () => {
    const classes = useStyles();
    const [searchText, setSearchText] = React.useState('');

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Nutrition</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent></IonContent>
        </IonPage>
    );
};

export default Nutrition;
