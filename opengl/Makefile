CXX = g++
CXXFLAGS = -std=c++17 -Iinclude -I/opt/homebrew/include -DGL_SILENCE_DEPRECATION
LDFLAGS = -L/opt/homebrew/lib -lglfw -framework OpenGL

SRC = $(wildcard src/*.cpp)
OBJ = $(SRC:.cpp=.o)
TARGET = opengl_app

all: $(TARGET)

$(TARGET): $(OBJ)
	$(CXX) -o $@ $^ $(LDFLAGS)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(OBJ) $(TARGET)