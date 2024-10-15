
declare global {
	namespace Book {
		interface Page {
			frontPageTitle?: string;
			frontPageImage?: string;
			backPageTitle?: string;
			backPageImage?: string;
			id: string;
		}
	}
}

export {};
