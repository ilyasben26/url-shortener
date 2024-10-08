import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import Analytics from "./_components/analytics";

interface AnalyticsPageProps {
    params: {
        shortcode: string;
    };
}


export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
    const { shortcode } = params;

    return (<div>
        <SignedIn>
            <Analytics shortcode={shortcode} />
        </SignedIn>
        <SignedOut>
            <RedirectToSignIn />
        </SignedOut>
    </div>);
}