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
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Shopping</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
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
                {searchText}
            </IonContent>
        </IonPage>
    );
};

export default Shopping;
