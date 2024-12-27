# %%
import math


class Vec3:
    def __init__(self, x=0.0, y=0.0, z=0.0):
        """Initialize a 3D vector."""
        self.e = [x, y, z]

    # Accessor properties
    @property
    def x(self):
        return self.e[0]

    @property
    def y(self):
        return self.e[1]

    @property
    def z(self):
        return self.e[2]

    @x.setter
    def x(self, value):
        self.e[0] = value

    @y.setter
    def y(self, value):
        self.e[1] = value

    @z.setter
    def z(self, value):
        self.e[2] = value

    @property
    def r(self):
        return self.e[0]

    @property
    def g(self):
        return self.e[1]

    @property
    def b(self):
        return self.e[2]

    @r.setter
    def r(self, value):
        self.e[0] = value

    @g.setter
    def g(self, value):
        self.e[1] = value

    @b.setter
    def b(self, value):
        self.e[2] = value

    def __str__(self):
        return f"{self.e[0]} {self.e[1]} {self.e[2]}"

    def __repr__(self):
        return f"Vec3({self.e[0]}, {self.e[1]}, {self.e[2]})"


v1 = Vec3(1, 2, 3)
v2 = Vec3(4, -5, 6)
v1, v2

# %%

"""
import math

    # Operator Overloading
    def __neg__(self):
        return Vec3(-self.e[0], -self.e[1], -self.e[2])

    def __getitem__(self, index):
        return self.e[index]

    def __setitem__(self, index, value):
        self.e[index] = value

    def __iadd__(self, other):
        self.e[0] += other.e[0]
        self.e[1] += other.e[1]
        self.e[2] += other.e[2]
        return self

    def __isub__(self, other):
        self.e[0] -= other.e[0]
        self.e[1] -= other.e[1]
        self.e[2] -= other.e[2]
        return self

    def __imul__(self, scalar):
        self.e[0] *= scalar
        self.e[1] *= scalar
        self.e[2] *= scalar
        return self

    def __itruediv__(self, scalar):
        return self.__imul__(1 / scalar)

    def __add__(self, other):
        return Vec3(self.e[0] + other.e[0],
                    self.e[1] + other.e[1],
                    self.e[2] + other.e[2])

    def __sub__(self, other):
        return Vec3(self.e[0] - other.e[0],
                    self.e[1] - other.e[1],
                    self.e[2] - other.e[2])

    def __mul__(self, other):
        if isinstance(other, Vec3):
            # Element-wise multiplication
            return Vec3(self.e[0] * other.e[0],
                        self.e[1] * other.e[1],
                        self.e[2] * other.e[2])
        elif isinstance(other, (int, float)):
            # Scalar multiplication
            return Vec3(self.e[0] * other,
                        self.e[1] * other,
                        self.e[2] * other)
        else:
            raise TypeError("Unsupported operand type(s) for *: 'Vec3' and '{}'".format(type(other)))

    def __rmul__(self, scalar):
        return self.__mul__(scalar)

    def __truediv__(self, scalar):
        return self.__mul__(1 / scalar)

    def length(self):
        return math.sqrt(self.length_squared())

    def length_squared(self):
        return self.e[0]**2 + self.e[1]**2 + self.e[2]**2

    # Additional utility methods
    def dot(self, other):
        return (self.e[0] * other.e[0] +
                self.e[1] * other.e[1] +
                self.e[2] * other.e[2])

    def cross(self, other):
        return Vec3(self.e[1] * other.e[2] - self.e[2] * other.e[1],
                    self.e[2] * other.e[0] - self.e[0] * other.e[2],
                    self.e[0] * other.e[1] - self.e[1] * other.e[0])

    def unit_vector(self):
        return self / self.length()

# Alias point3 for Vec3 for geometric clarity
Point3 = Vec3

"""
