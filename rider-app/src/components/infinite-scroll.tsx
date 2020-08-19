import * as React from 'react';
import {IonInfiniteScroll, IonInfiniteScrollContent} from '@ionic/react';

type Props = {
    isLoading: boolean;
    disabled: boolean;
    handleScrollEvent: () => void;
};

const InfiniteScroll = ({isLoading, disabled, handleScrollEvent}: Props) => {
    const infiniteScrollRef = React.useRef<HTMLIonInfiniteScrollElement | null>(
        document.getElementById('infiniteScroll') as HTMLIonInfiniteScrollElement
    );

    React.useEffect(() => {
        if (!isLoading) {
            if (!infiniteScrollRef.current) {
                infiniteScrollRef.current = document.getElementById(
                    'infiniteScroll'
                ) as HTMLIonInfiniteScrollElement;
            }
            infiniteScrollRef.current?.complete();
        }
    }, [isLoading]);

    return (
        <IonInfiniteScroll
            threshold="100px"
            id="infiniteScroll"
            disabled={disabled}
            onIonInfinite={() => handleScrollEvent()}
        >
            <IonInfiniteScrollContent loadingSpinner="crescent" loadingText="Cargando..." />
        </IonInfiniteScroll>
    );
};

export default InfiniteScroll;
