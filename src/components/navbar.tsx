"use server"

import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default async function Navbar() {
    return (
        <div className="flex justify-end align-middle p-4 space-x-4">
            <SignedOut >
                <ClerkLoading>

                    <Button variant="outline" disabled>
                        Sign In
                    </Button>
                    <Button variant="outline" disabled>
                        Sign Up
                    </Button>

                </ClerkLoading>
                <ClerkLoaded>
                    <SignInButton>
                        <Button variant="outline">
                            Sign In
                        </Button>
                    </SignInButton>

                    <SignUpButton >
                        <Button variant="outline">
                            Sign Up
                        </Button>
                    </SignUpButton>
                </ClerkLoaded>

            </SignedOut>
            <SignedIn>
                <ClerkLoading>
                    <Button variant="outline" disabled>
                        Sign Out
                    </Button>
                    <Loader2 className="h-[28px] w-[28px] animate-spin self-center text-gray-400" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignOutButton >
                        <Button variant="outline">
                            Sign Out
                        </Button>
                    </SignOutButton>
                    <UserButton />
                </ClerkLoaded>
            </SignedIn>
        </div>
    )
}