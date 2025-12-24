interface Event {
    type: string;
    date: Date | null;
    date_str: string;
    time: string | null;
    location: string;
    address: string;
    city: string;
    state: string;
}

export { Event };