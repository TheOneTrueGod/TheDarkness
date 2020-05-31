export const SET_LOCATION: string = 'SET_LOCATION';

type setLocationProps = {
    href: string,
};
export interface setLocationResult {
    type: 'SET_LOCATION',
    location: { href: string },
};

export function setLocation({ href }: setLocationProps): setLocationResult {
    return { type: 'SET_LOCATION', location: { href } };
}