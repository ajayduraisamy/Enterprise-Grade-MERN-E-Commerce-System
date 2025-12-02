export const calculateFinalPrice = (
    price: number,
    offerPercent?: number
): number => {

    if (!offerPercent) return price;

    return Math.round(
        price - (price * offerPercent) / 100
    );
};
