import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex size-full items-center justify-center text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 text-white dark:text-black" />
            </div>
            {/* <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Kothari Fine Jewels
                </span>
            </div> */}
        </>
    );
}
