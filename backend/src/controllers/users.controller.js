const prisma = require('../utils/prisma');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      },
      orderBy: [
        { role: 'asc' },
        { email: 'asc' }
      ]
    });

    const grouped = users.reduce((acc, user) => {
      if (!acc[user.role]) {
        acc[user.role] = [];
      }
      acc[user.role].push(user);
      return acc;
    }, {});

    res.json({ 
      success: true, 
      data: users,
      grouped,
      summary: {
        total: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        analysts: users.filter(u => u.role === 'ANALYST').length,
        viewers: users.filter(u => u.role === 'VIEWER').length
      }
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
};

exports.getSeededCredentials = async (req, res) => {
  const credentials = {
    admins: [
      { email: 'admin1@test.com', password: 'admin123', role: 'ADMIN' },
      { email: 'admin2@test.com', password: 'admin123', role: 'ADMIN' }
    ],
    analysts: [
      { email: 'analyst1@test.com', password: 'analyst123', role: 'ANALYST' },
      { email: 'analyst2@test.com', password: 'analyst123', role: 'ANALYST' },
      { email: 'analyst3@test.com', password: 'analyst123', role: 'ANALYST' },
      { email: 'analyst4@test.com', password: 'analyst123', role: 'ANALYST' },
      { email: 'analyst5@test.com', password: 'analyst123', role: 'ANALYST' }
    ],
    viewers: Array.from({ length: 50 }, (_, i) => ({
      email: `viewer${i + 1}@test.com`,
      password: 'viewer123',
      role: 'VIEWER'
    }))
  };

  res.json({ 
    success: true, 
    data: credentials,
    note: 'These are the predefined test credentials in the database'
  });
};
