import React from 'react';
import {createUseStyles} from 'react-jss';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar} from '@ionic/react';

const useStyles = createUseStyles((theme) => ({
    test: {
        color: 'red',
    },
}));

const Shopping: React.FC = () => {
    const classes = useStyles();
    const [searchText, setSearchText] = React.useState('');

    return (
        <IonPage>
            <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Shopping</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={(e) => setSearchText(e.detail.value!)}
                        debounce={1000}
                        animated
                        placeholder="Busca tus productos aquí"
                        showCancelButton="focus"
                    ></IonSearchbar>
                </IonToolbar>
            </IonHeader>
            <IonContent>{searchText}</IonContent>
        </IonPage>
    );
};

export default Shopping;
