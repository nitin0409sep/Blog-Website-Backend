import jsonwebtoken from 'jsonwebtoken';

export const jwtTokens = (user_args: { user_id: string, email: string, user_name: string, role_id: string }) => {
    try {
        const user = user_args;

        // Ensure the secrets are defined
        if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
            throw new Error("Missing token secrets in environment variables");
        }

        // Generate access and refresh tokens
        const accessToken = jsonwebtoken.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '350h' });
        const refreshToken = jsonwebtoken.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '5m' });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating JWT tokens:", error);
        throw new Error("Failed to generate tokens");
    }
}
