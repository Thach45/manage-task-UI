import { Button, Card, Col, DatePicker, Form, Modal, Row, Select, Space, Statistic, Table, Typography } from 'antd';
import { Input } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined, ClockCircleOutlined, FlagOutlined, CalendarOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'; // Import the PlusOutlined icon
import React, { useEffect, useState, useMemo } from 'react';
import Search from 'antd/es/transfer/search';
import Task from '../model/model';
import TextArea from 'antd/es/input/TextArea';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Paragraph } = Typography;





const Main = () => {
    let [data, setData] = useState<Task[]>([]);
    let [page, setPage] = useState(1);
    let [deleteId, setDeleteId] = useState('');
    let [isModalVisible, setIsModalVisible] = useState(false);
    let [editingTask, setEditingTask] = useState<Task | null>(null);
    let [createTask, setCreateTask] = useState<Task | null>(null);
    let [showDetail, setShowDetail] = useState<Task | null>(null);
    const [form] = Form.useForm();
    const [totalItems, setTotalItems] = useState(0);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterTime, setFilterTime] = useState('');


    const limit: number = 6;
    useEffect(() => {
        fetch(`https://manage-task-six.vercel.app/api/v1/tasks?page=1&limit=99999`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                data.forEach((task: Task) => {
                    task.timeStart = new Date(task.timeStart);
                    task.timeEnd = new Date(task.timeEnd);

                });
                setTotalItems(data.length);
                let filteredData = filterStatus === '' ? data : data.filter((task: Task) => task.status === filterStatus);
                if (filterTime === 'today') {
                    const today = new Date();
                    filteredData = filteredData.filter((task: Task) => task.timeEnd?.getDate() === today.getDate() && task.timeEnd?.getMonth() === today.getMonth() && task.timeEnd?.getFullYear() === today.getFullYear());
                }
                else if (filterTime === 'nextWeek') {
                    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                    filteredData = filteredData.filter((task: Task) => task.timeEnd?.getDate() === nextWeek.getDate() && task.timeEnd?.getMonth() === nextWeek.getMonth() && task.timeEnd?.getFullYear() === nextWeek.getFullYear());
                } else{
                    filteredData = data
                }

                console.log(filteredData);
                setData(filteredData);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);

            });

    }, [deleteId, createTask, filterStatus, filterTime]);
    useEffect(() => {
        fetch(`https://manage-task-six.vercel.app/api/v1/tasks/delete/${deleteId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                setDeleteId('');
            })

    }, [deleteId]);


    const columns = useMemo(() => [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a: Task, b: Task) => (a.title || '').localeCompare(b.title || '')

        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a: Task, b: Task) => (a.status ? 1 : -1)

        },
        {
            title: 'Time start',
            dataIndex: 'timeStart',
            key: 'timeStart',
            render: (date: Date) => date.toLocaleDateString(),
            sorter: (a: Task, b: Task) => (a.timeStart || new Date()).getTime() - (b.timeStart || new Date()).getTime()

        },
        {
            title: 'Time end',
            dataIndex: 'timeEnd',
            key: 'timeEnd',
            render: (date: Date) => date.toLocaleDateString(),
            sorter: (a: Task, b: Task) => (a.timeEnd || new Date()).getTime() - (b.timeEnd || new Date()).getTime()

        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Task) => (
                <Space size="middle">
                    <Button icon={<EyeOutlined />} onClick={() => setShowDetail(record)}>View</Button>
                    <Button icon={<EditOutlined />} onClick={() => {
                        setEditingTask(record);

                    }}>
                        Edit
                    </Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record._id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ], []);
    const onFinish = (values: any) => {
        const [timeStart, timeEnd] = values.timeRange;
        const task: Task = {
            title: values.title,
            content: values.description,
            status: values.status,
            timeStart,
            timeEnd,
            deleted: false,
        };
        if (editingTask) {
            fetch(`https://manage-task-six.vercel.app/api/v1/tasks/edit/${editingTask._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            })
                .then(response => response.json())
                .then((data) => {
                    console.log(data);
                    setIsModalVisible(false);
                    setEditingTask(null);
                })
            return;
        }
        else {

            fetch(`https://manage-task-six.vercel.app/api/v1/tasks/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            })
                .then(response => response.json())
                .then((data) => {
                    console.log(data);
                    setCreateTask(data);
                    setIsModalVisible(false);
                })
        }

    }

    useEffect(() => {
        if (editingTask) {
            form.setFieldsValue({
                title: editingTask.title,
                description: editingTask.content,
                status: editingTask.status,

            });
        } else {
            form.resetFields();
        }
    }, [editingTask, form]);

    function formatDate(date: Date | undefined) {
        return date ? date.toLocaleDateString() : '';
    }

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this task?',
            content: 'This action cannot be undone.',
            onOk() {
                setDeleteId(id);
            },
        });
    };

    return (
        <div className="site-layout-content " style={{ margin: 'auto', width: "80%" }}>
            <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '20px' }}>Task Management</h1>
            <Card title="Task List" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>Add Task</Button>}>
                <Modal
                    title={editingTask ? "Edit Task" : "Add New Task"}
                    visible={isModalVisible || editingTask ? true : false}
                    onCancel={() => {
                        setIsModalVisible(false);
                        setEditingTask(null);
                        form.resetFields();
                    }}
                    footer={null}
                >
                    <Form
                        layout="vertical"


                        form={form}

                        onFinish={onFinish}

                    >
                        <Form.Item
                            name="title"
                            label="Title"

                            rules={[{ required: true, message: 'Please input the title!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please input the description!' }]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select the status!' }]}
                        >
                            <Select>
                                <Option value="Not Started">Not Started</Option>
                                <Option value="In Progress">In Progress</Option>
                                <Option value="Completed">Completed</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="priority"
                            label="Priority"
                            rules={[{ required: true, message: 'Please select the priority!' }]}
                        >
                            <Select>
                                <Option value="Low">Low</Option>
                                <Option value="Medium">Medium</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="timeRange"
                            label="Time Range"
                            rules={[{ required: true, message: 'Please select the time range!' }]}
                        >
                            <RangePicker showTime format="YYYY-MM-DD HH:mm" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit"  >
                                {editingTask ? 'Update Task' : 'Add Task'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title={<Title level={4}>{showDetail?.title}</Title>}
                    visible={showDetail ? true : false}
                    onCancel={() => setShowDetail(null)}
                    footer={[
                        <Button key="back" onClick={() => setShowDetail(null)}>
                            Close
                        </Button>,
                    ]}
                    width={700}
                >
                    {showDetail && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic
                                        title="Status"
                                        value={showDetail.status}
                                        valueStyle={{ color: showDetail.status === 'Completed' ? '#3f8600' : '#cf1322' }}
                                        prefix={showDetail.status === 'Completed' ? <CheckCircleFilled /> : <CloseCircleFilled />}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Priority"
                                        value={showDetail.priority}
                                        prefix={<FlagOutlined style={{ color: showDetail.priority === 'High' ? '#cf1322' : showDetail.priority === 'Medium' ? '#faad14' : '#52c41a' }} />}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic
                                        title="Created At"
                                        value={formatDate(new Date(showDetail?.timeStart))}
                                        prefix={<CalendarOutlined />}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="Due Date"
                                        value={formatDate(new Date(showDetail?.timeEnd))}
                                        prefix={<ClockCircleOutlined />}
                                    />
                                </Col>
                            </Row>
                            <div>
                                <Title level={5}>Description</Title>
                                <Paragraph>{showDetail?.content}</Paragraph>
                            </div>
                        </div>
                    )}
                </Modal>


            </Card>
            <Card title="Task List">
                <Space style={{ marginBottom: '16px' }}>
                    <Search
                        placeholder="Search tasks"

                    />
                    <Select
                        defaultValue=""
                        style={{ width: 120 }}
                        onChange={(value) => setFilterStatus(value)}

                    >
                        <Option value="">All</Option>
                        <Option value="Not Started">Not Started</Option>
                        <Option value="In Progress">In Progress</Option>
                        <Option value="Completed">Completed</Option>
                    </Select>
                    <Select
                        defaultValue=""
                        style={{ width: 120 }}
                        onChange={(value) => {
                            if (value === 'today') {
                                setFilterTime("today");
                               
                            }
                            if (value === 'nextWeek') {
                                setFilterTime("nextWeek");
                               
                            }
                            if (value === '') {
                                setFilterTime('');
                            }
                        }}

                    >
                        <Option value="">All</Option>
                        <Option value="today">Today</Option>
                        <Option value="nextWeek">Next Week</Option>
                    </Select>
                </Space>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="_id"
                    pagination={{ pageSize: limit, current: page, total: totalItems, onChange: (page) => setPage(page) }}
                    loading={data.length === 0}
                    sortDirections={['ascend', 'descend']}

                />
            </Card>
        </div>
    );
}

export default Main;

