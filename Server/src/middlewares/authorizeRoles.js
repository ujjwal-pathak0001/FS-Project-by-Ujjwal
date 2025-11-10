export const authorizeRoles = (...allowedRoles) => {
	return (req, res, next) => {
		try {
			const user = req.user;
			if (!user?.role) {
				return res.status(403).json({ message: "Missing role on token" });
			}
			if (!allowedRoles.includes(user.role)) {
				return res.status(403).json({ message: "Insufficient role" });
			}
			next();
		} catch (err) {
			return res.status(500).json({ message: "Authorization failed" });
		}
	};
};


