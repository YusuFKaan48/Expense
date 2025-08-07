import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, Pressable, ScrollView} from 'react-native';

type ModalOption = { label: string; value: string | number };

type FilterType = 'year' | 'month' | 'day' | 'category' | 'currency' | null;

type FilterModalProps = {
    visible: boolean;
    setVisible: (val: boolean) => void;
    activeStep: 'filterType' | 'filterOptions';
    setActiveStep: (val: 'filterType' | 'filterOptions') => void;
    onSelectFilterType: (type: FilterType) => void;
    filterType: FilterType;
    options: ModalOption[];
    selected: string | number | null;
    setSelected: (val: string | number | null) => void;
    onClearAll: () => void;
    onBackToTypes: () => void;
};

export function FilterModal({
                                visible,
                                setVisible,
                                activeStep,
                                setActiveStep,
                                onSelectFilterType,
                                filterType,
                                options,
                                selected,
                                setSelected,
                                onClearAll,
                                onBackToTypes,
                            }: FilterModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    justifyContent: 'center',
                    paddingHorizontal: 24,
                }}
            >
                <View
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 20,
                        paddingVertical: 20,
                        paddingHorizontal: 16,
                        maxHeight: '70%',
                    }}
                >
                    {activeStep === 'filterType' && (
                        <>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    marginBottom: 16,
                                }}
                            >
                                Filtre Türü Seç
                            </Text>
                            <ScrollView
                                contentContainerStyle={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                }}
                            >
                                {[
                                    {label: 'Yıl', value: 'year'},
                                    {label: 'Ay', value: 'month'},
                                    {label: 'Gün', value: 'day'},
                                    {label: 'Kategori', value: 'category'},
                                    {label: 'Para Birimi', value: 'currency'},
                                ].map((opt) => (
                                    <Pressable
                                        key={opt.value.toString()}
                                        onPress={() => onSelectFilterType(opt.value as FilterType)}
                                        style={{
                                            width: '30%',
                                            marginVertical: 8,
                                            backgroundColor: '#BFDBFE',
                                            paddingVertical: 10,
                                            borderRadius: 9999,
                                            alignItems: 'center',
                                            marginHorizontal: 4,
                                        }}
                                    >
                                        <Text style={{fontWeight: '600', color: '#2563EB'}}>
                                            {opt.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                            <Pressable
                                onPress={() => {
                                    onClearAll();
                                    setVisible(false);
                                }}
                                style={{
                                    marginTop: 16,
                                    backgroundColor: '#FCA5A5',
                                    paddingVertical: 12,
                                    borderRadius: 9999,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{fontWeight: '600', color: '#B91C1C'}}>
                                    Tümünü Temizle
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setVisible(false)}
                                style={{
                                    marginTop: 8,
                                    backgroundColor: '#E5E7EB',
                                    paddingVertical: 12,
                                    borderRadius: 9999,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{fontWeight: '600', color: '#374151'}}>Kapat</Text>
                            </Pressable>
                        </>
                    )}

                    {activeStep === 'filterOptions' && (
                        <>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 12,
                                }}
                            >
                                <Pressable onPress={onBackToTypes}>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: '#2563EB',
                                            fontWeight: '600',
                                        }}
                                    >
                                        {'< Geri'}
                                    </Text>
                                </Pressable>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        flex: 1,
                                    }}
                                >
                                    {filterType === 'year' && 'Yıl Seçimi'}
                                    {filterType === 'month' && 'Ay Seçimi'}
                                    {filterType === 'day' && 'Gün Seçimi'}
                                    {filterType === 'category' && 'Kategori Seçimi'}
                                    {filterType === 'currency' && 'Para Birimi Seçimi'}
                                </Text>
                                <View style={{width: 50}}/>
                            </View>

                            <ScrollView
                                contentContainerStyle={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                }}
                            >
                                {options.map((opt) => {
                                    const isSelected = selected === opt.value;
                                    return (
                                        <Pressable
                                            key={opt.value.toString()}
                                            onPress={() => setSelected(opt.value)}
                                            style={{
                                                width: '30%',
                                                marginVertical: 8,
                                                backgroundColor: isSelected ? '#2563EB' : '#BFDBFE',
                                                paddingVertical: 10,
                                                borderRadius: 9999,
                                                alignItems: 'center',
                                                marginHorizontal: 4,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontWeight: '600',
                                                    color: isSelected ? 'white' : '#2563EB',
                                                }}
                                            >
                                                {opt.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                            <Pressable
                                onPress={() => {
                                    setSelected(null);
                                    setVisible(false);
                                }}
                                style={{
                                    marginTop: 16,
                                    backgroundColor: '#FCA5A5',
                                    paddingVertical: 12,
                                    borderRadius: 9999,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{fontWeight: '600', color: '#B91C1C'}}>
                                    Temizle
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setVisible(false)}
                                style={{
                                    marginTop: 8,
                                    backgroundColor: '#E5E7EB',
                                    paddingVertical: 12,
                                    borderRadius: 9999,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{fontWeight: '600', color: '#374151'}}>Kapat</Text>
                            </Pressable>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}
