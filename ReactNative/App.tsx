import { StatsigBootstrapProvider } from "@statsig/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = {
    userID: "user-123", // add additional parameters as needed
  };
  return (
    <html lang="en">
      <body>
        <StatsigBootstrapProvider
          user={user}
          clientKey={process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY}
          serverKey={process.env.STATSIG_SERVER_KEY}
        >
          {children}
        </StatsigBootstrapProvider>
      </body>
    </html>
  );
}
