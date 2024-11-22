
export class Navbar {

	constructor() {
		const container = document.getElementById('header-outer') as HTMLDivElement | null;
		if (!container) return;

		const navbar = document.createElement('div') as HTMLDivElement;
		navbar.style.height = '64px';
		navbar.style.backgroundColor = 'rgb(35, 38, 45)';
		navbar.style.display = 'flex';
		navbar.style.flexDirection = 'row';
		navbar.style.alignItems = 'center';
		navbar.style.boxShadow = '0 0 3px 0 rgba(0, 0, 0, 0.3)';

		const logo = document.getElementById('header-logo') as HTMLDivElement;
		const userNav = document.getElementById('user-nav') as HTMLDivElement;
		const headerSearchBar = document.getElementById('header-search-bar') as HTMLDivElement;

		const subNav = document.getElementById('header-nav') as HTMLUListElement;

		navbar.append(logo);
		navbar.append(subNav);
		navbar.append(headerSearchBar);
		navbar.append(userNav);

		container.prepend(navbar);

		this.fixNotificationBtn();
		this.fixDiscordBtn();
		this.cleanLocaleBtn();

		this.fixUserNav();

		document.getElementById('header-top')?.remove();
	}

	private fixUserNav() {
		const userNavContainer = document.getElementById('user-nav-menu') as HTMLDivElement | null;
		if (!userNavContainer) return;

		userNavContainer.style.margin = '0';

		const anchor = userNavContainer.querySelector('a')!;
		const button = userNavContainer.querySelector('button')!;

		const img = anchor.querySelector('img')!;
		img.width = 38;
		img.height = 38;

		anchor.remove();

		button.innerHTML = '';
		button.append(img);
	}

	private fixNotificationBtn() {
		const notificationBtnContainer = document.getElementById('notifications-icon') as HTMLDivElement | null;
		if (!notificationBtnContainer) return;
		
		const span = notificationBtnContainer.querySelector('span')!;
		const div = span.querySelector('div')!;
		
		div.style.width = '38px';
		div.style.height = '38px';

		const spanIcon = div.querySelector('span')!;
		spanIcon.style.fontSize = '20px';
	}

	private fixDiscordBtn() {
		const discordBtnContainer = document.getElementById('discord-icon') as HTMLDivElement | null;
		if (!discordBtnContainer) return;

		const anchor = discordBtnContainer.querySelector('a')!;
		const div = anchor.querySelector('div')!;
		div.style.width = '38px';
		div.style.height = '38px';

		const img = div.querySelector('img')!;
		img.width = 20;

		const notification = anchor.querySelector('span')!;
		notification.innerHTML = '';
	}

	private cleanLocaleBtn() {
		const localeBtnContainer = document.getElementById('user-locale') as HTMLDivElement | null;
		if (!localeBtnContainer) return;

		const localeBtn = localeBtnContainer.querySelector('button') as HTMLButtonElement;
		const flag = localeBtn.querySelector('img') as HTMLImageElement;

		localeBtn.innerHTML = '';

		const div = document.createElement('div');
		div.style.width = '38px';
    div.style.height = '38px';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.style.transition = 'all .2s';
    div.style.borderRadius = '50%';
    div.style.backgroundColor = 'rgba(255, 255, 255, .06)';

		const img = document.createElement('img');
		img.src = flag.src;
		img.width = 20;

		div.append(img);
		localeBtn.append(div);
		localeBtn.style.display = 'flex'; // show the button after fix (hidden in the CSS file)

		const ulDropdown = localeBtnContainer.querySelector('ul') as HTMLUListElement;
		ulDropdown.style.background = '#23262d';
	}
}