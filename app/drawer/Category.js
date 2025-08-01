import CategoryCreate from "../../app/../components/Category/CategoryCreate";
import {View} from "react-native";

export default function Category() {

    return (
        <View className="flex-1 bg-white px-4 pt-6 pb-2 ">
            <CategoryCreate/>
        </View>
    );
}
