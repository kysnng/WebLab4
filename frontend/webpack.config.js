const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, "src/index.jsx"),
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "../src/main/webapp/assets"),
        publicPath: "auto"
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-env", { targets: "defaults" }],
                            ["@babel/preset-react", { runtime: "automatic" }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
};
